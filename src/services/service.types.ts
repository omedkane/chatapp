export class ApiResponse<T> {
  data: T;
  fetchDate = Date.now();
  constructor(data: T) {
    this.data = data;
  }
}
