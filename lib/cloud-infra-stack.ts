
import * as cdk from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from 'constructs';

export interface CloudInfraStackProps extends cdk.StackProps {
  readonly keypairName: string;

  readonly safeIp: string;
}

export class CloudInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CloudInfraStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      cidr: '10.90.0.0/22',
      maxAzs: 2,
      natGateways: 0,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          name: 'public-subnet',
          subnetType: ec2.SubnetType.PUBLIC,
          mapPublicIpOnLaunch: true,
          cidrMask: 24
        }
      ]
    });

    const ec2Sg = new ec2.SecurityGroup(this, 'Ec2SecurityGroup', {
      vpc,
      description: 'Allow SSH (TCP port 22) connection from Specific IP and HTTP (tcp port 80) from anywhere',
      allowAllOutbound: true
    });
    ec2Sg.addIngressRule(ec2.Peer.ipv4(props.safeIp), ec2.Port.tcp(22));
    ec2Sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

    const ec2Role = new iam.Role(this, 'Ec2InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });

    const machineImage = ec2.MachineImage.fromSsmParameter('/aws/service/canonical/ubuntu/server/focal/stable/current/amd64/hvm/ebs-gp2/ami-id', {
      os: ec2.OperatingSystemType.LINUX,
    })
    ec2.AmazonLinuxImage.ssmParameterName()
    const ec2Instance = new ec2.Instance(this, 'GreeterApiEC2', {
      vpc,
      machineImage,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3A, ec2.InstanceSize.MICRO),
      role: ec2Role,
      securityGroup: ec2Sg,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      keyName: props.keypairName
    });

    new cdk.CfnOutput(this, 'Ec2PublicIP', {
      value: ec2Instance.instancePublicIp
    });
  }
}
