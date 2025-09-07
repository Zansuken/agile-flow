import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment content',
    example: 'This looks good! Can we add some tests for this feature?',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @ApiProperty({
    description: 'ID of parent comment for threading',
    example: 'comment-123',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({
    description: 'Mentioned user IDs in the comment',
    example: ['user-123', 'user-456'],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  mentions?: string[];
}
