import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, StreamViewType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export enum Gsi {
  SkPkIndex = 'SkPkIndex',
  Gs1Index = 'gs1',
  Gs2Index = 'gs2',
}

export interface BaseTableProps {
  readonly tableName: string;
}

export class BaseTable extends Table {
  constructor(scope: Construct, props: BaseTableProps) {
    const { tableName } = props;

    super(scope, 'Table', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      partitionKey: {
        name: 'pk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      tableName,
    });

    const addGSI = (indexName: string, partitionKeyName: string, sortKeyName: string): void =>
      this.addGlobalSecondaryIndex({
        indexName,
        partitionKey: {
          name: partitionKeyName,
          type: AttributeType.STRING,
        },
        sortKey: {
          name: sortKeyName,
          type: AttributeType.STRING,
        },
      });

    addGSI(Gsi.SkPkIndex, 'sk', 'pk');
    addGSI(Gsi.Gs1Index, 'gs1pk', 'gs1sk');
    addGSI(Gsi.Gs2Index, 'gs2pk', 'gs2sk');
  }
}
