import {Page} from "../type";

export class PagedEntities<T> {
  data: T[]
  page: Page

  constructor(data: T[], page: Page) {
    this.data = data
    this.page = page
  }
}