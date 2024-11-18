export interface Rank {
  id: string;
  rank?: number;
  score?: number;
  totalQuizCount?: number;
  totalSolvedQuizCount?: number;
}

export interface TopRank {
  topRankers: Ranker[];
}

export interface NearRank {
  nearRankers: RankerWithDetails[];
}

export interface AllRank {
  allRankers: RankerWithDetails[];
  pagination: Pagination;
}

export interface Ranker {
  id: string;
  rank: number;
  score: number;
}

export interface RankerWithDetails extends Ranker {
  totalQuizCount: number;
  totalSolvedQuizCount: number;
}

export interface Pagination {
  currentPage: number;
  totalPage: number;
}