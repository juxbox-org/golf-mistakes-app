export interface Route {
  path: string;
  params: RouteParams;
}

declare interface RouteParams {
  hole_no: string;
}
