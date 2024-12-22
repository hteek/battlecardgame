import { EventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export interface BaseEventBusProps {
  readonly eventBusName: string;
}

export class BaseEventBus extends EventBus {
  constructor(scope: Construct, props: BaseEventBusProps) {
    const { eventBusName } = props;

    super(scope, 'EventBus', {
      eventBusName,
    });
  }
}
