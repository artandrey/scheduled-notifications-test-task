import { Transactional } from '@nestjs-cls/transactional';
import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lt } from 'drizzle-orm';

import { processedEvents } from 'src/shared/modules/persistence/infrastructure/drizzle/schema';
import { CjsDrizzleAdapter } from 'src/shared/modules/persistence/infrastructure/drizzle/types';

@Injectable()
export class InboxCleanupService {
  private readonly _logger = new Logger(InboxCleanupService.name);

  constructor(private readonly _transactionHost: TransactionHost<CjsDrizzleAdapter>) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  @Transactional()
  async cleanupOldProcessedEvents(): Promise<void> {
    try {
      // Clean up processed events older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await this._transactionHost.tx
        .delete(processedEvents)
        .where(lt(processedEvents.createdAt, sevenDaysAgo));

      const deletedCount = result.rowCount || 0;

      if (deletedCount > 0) {
        this._logger.log(`Cleaned up ${deletedCount} old processed events from inbox table`);
      }
    } catch (error) {
      this._logger.error(`Failed to cleanup old processed events: ${error.message}`, error.stack);
    }
  }
}
