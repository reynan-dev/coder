import { Args, Mutation, Query, Resolver } from "type-graphql";
import Common from "../models/Common.js";

@Resolver(Common)
export default class CommonResolver {
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }
}
