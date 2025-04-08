import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel({
  description: "Token response",
  name: "TokenResponse",
})
export default class TokenResponse {
  @ApiModelProperty({
    description: "The token",
    type: "string",
    required: true,
  })
  public token!: string;
}
