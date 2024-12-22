import { Duration, RemovalPolicy } from 'aws-cdk-lib';
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

export interface ClientSideRenderingDistributionProps {
  readonly certificate: ICertificate;
  readonly domainName: string;
  readonly bucket: IBucket;
}

export class ClientSideRenderingDistribution extends Distribution {
  constructor(scope: Construct, props: ClientSideRenderingDistributionProps) {
    const { bucket, certificate, domainName } = props;

    super(scope, 'FrontendDistribution', {
      certificate,
      defaultBehavior: {
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        origin: S3BucketOrigin.withOriginAccessControl(bucket),
        originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
        responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [domainName],
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(0),
        },
      ],
      logBucket: new Bucket(scope, 'FrontendDistributionAccessLogs', {
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
