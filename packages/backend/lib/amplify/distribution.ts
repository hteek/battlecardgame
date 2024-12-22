import { RemovalPolicy } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  OriginRequestPolicy,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
  BucketEncryption,
  IBucket,
  ObjectOwnership,
} from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface ConfigDistributionProps {
  readonly certificate: ICertificate;
  readonly domainName: string;
  readonly bucket: IBucket;
}

export class ConfigDistribution extends Distribution {
  constructor(scope: Construct, props: ConfigDistributionProps) {
    const { bucket, certificate, domainName } = props;
    const origin = S3BucketOrigin.withOriginAccessControl(bucket);

    super(scope, 'ConfigDistribution', {
      certificate,
      defaultBehavior: {
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        origin,
        originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
        responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [domainName],
      logBucket: new Bucket(scope, 'ConfigDistributionAccessLogs', {
        autoDeleteObjects: true,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        encryption: BucketEncryption.S3_MANAGED,
        accessControl: BucketAccessControl.LOG_DELIVERY_WRITE,
        objectOwnership: ObjectOwnership.OBJECT_WRITER,
        enforceSSL: true,
        removalPolicy: RemovalPolicy.DESTROY,
        versioned: false,
      }),
    });
  }
}
