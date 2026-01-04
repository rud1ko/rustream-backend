import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@/prisma/generated/client'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'

import { SocialLinkOrderInput } from './inputs/social-link-order.input'
import { SocialLinkInput } from './inputs/social-link.input'
import { SocialLinkModel } from './models/social-link.model'
import { SocialLinkService } from './social-link.service'

@Resolver('SocialLink')
export class SocialLinkResolver {
	constructor(private readonly socialLinkService: SocialLinkService) {}

	@Authorization()
	@Query(() => [SocialLinkModel], { name: 'findSocialLinks' })
	public async findSocialLinks(@Authorized('id') id: string) {
		return this.socialLinkService.findSocialLinks(id)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'createSocialLink' })
	public async createSocialLink(
		@Authorized() user: User,
		@Args('data') input: SocialLinkInput,
	) {
		return this.socialLinkService.createSocialLink(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'reorderSocialLinks' })
	public async reorderSocialLinks(
		@Args('list', { type: () => [SocialLinkOrderInput] })
		list: SocialLinkOrderInput[],
	) {
		return this.socialLinkService.reorderSocialLinks(list)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'updateSocialLink' })
	public async updateSocialLink(
		@Args('id') id: string,
		@Args('data') input: SocialLinkInput,
	) {
		return this.socialLinkService.updateSocialLink(id, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSocialLink' })
	public async removeSocialLink(@Args('id') id: string) {
		return this.socialLinkService.removeSocialLink(id)
	}
}
