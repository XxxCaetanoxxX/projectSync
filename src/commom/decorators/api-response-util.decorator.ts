import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

interface ApiResponseInterface {
    status: number;
    summary: string;
    example: object | string;
    description?: string;
    deprecated?: boolean;
}

export function ApiResponseUtil({ summary, example, status, description, deprecated = false }: ApiResponseInterface) {
    return applyDecorators(
        ApiOperation({
            summary,
            description,
            deprecated,
        }),
        ApiResponse({
            status,
            example,
        }),
    );
}
