import { Handler } from 'aws-lambda';

export const handler: Handler<void, void> = async (): Promise<void> => {
  console.log('test handler called');
};
