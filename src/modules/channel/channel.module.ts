import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';
import { TargetModule } from './target/target.module';

@Module({
  providers: [ChannelResolver, ChannelService],
  imports: [TargetModule],
})
export class ChannelModule {}
