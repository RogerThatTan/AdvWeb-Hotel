import { Inject, Injectable } from '@nestjs/common';
import { Paginated } from '../interfaces/paginated.interface';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../DTOs/pagination-query.dto';

@Injectable()
export class PaginationProvider {
  constructor(
    /**
     * Injecting request
     */
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    let results = await repository.find({
      skip: ((paginationQuery.page ?? 1) - 1) * (paginationQuery.limit ?? 10),
      take: paginationQuery.limit ?? 10,
    });

    /**
     * Create the request URLS
     */

    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newURL = new URL(this.request.url, baseURL);
    console.log('baseURL', newURL);

    /**
     * Calculate the page number
     */
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / (paginationQuery.limit ?? 10));
    const nextPage =
      paginationQuery.page === totalPages
        ? paginationQuery.page
        : (paginationQuery.page ?? 1) + 1;

    const previousPage =
      paginationQuery.page === totalPages
        ? paginationQuery.page
        : (paginationQuery.page ?? 1) - 1;

    const finalReponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: paginationQuery.limit ?? 10,
        totalItems: totalItems,
        currentPage: paginationQuery.page ?? 1,
        totalPages: totalPages,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=1`,
        last: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
        current: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${paginationQuery.page}`,
        next: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
        previous: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${previousPage}`,
      },
    };
    return finalReponse;
  }
}
