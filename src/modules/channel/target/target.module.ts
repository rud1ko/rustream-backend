import { Module } from '@nestjs/common';
import { TargetService } from './target.service';
import { TargetResolver } from './target.resolver';

@Module({
  providers: [TargetResolver, TargetService],
})
export class TargetModule {}
