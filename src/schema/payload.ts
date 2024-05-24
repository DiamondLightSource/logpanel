import { PayloadInterface } from './interfaces';
export const payload: PayloadInterface = {
  parameters: [],
  queries: [
    {
      query: {
        type: 'elasticsearch',
        query_string: '',
      },
      timerange: {
        from: 300,
        type: 'relative',
      },
      filters: [],
      search_types: [
        {
          limit: 100,
          offset: 0,
          sort: [
            {
              field: 'timestamp',
              order: 'DESC',
            },
          ],
          fields: [],
          decorators: [],
          type: 'messages',
          filter: null,
          filters: [],
        },
      ],
    },
  ],
};
