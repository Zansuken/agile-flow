import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Updated comment content',
    example:
      'This looks good! Can we add some tests for this feature? [Edited]',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @ApiProperty({
    description: 'Updated mentioned user IDs in the comment',
    example: ['user-123', 'user-456'],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  mentions?: string[];
}
