
resource "aws_api_gateway_rest_api" "gff_gateway" {
  name        = "gff_gateway-api"
  description = "Gateway da API GFF"
}

resource "aws_api_gateway_resource" "resource_root" {
  rest_api_id = aws_api_gateway_rest_api.gff_gateway.id
  parent_id   = aws_api_gateway_rest_api.gff_gateway.root_resource_id
  path_part   = "root"
}

resource "aws_api_gateway_method" "get" {
  rest_api_id   = aws_api_gateway_rest_api.gff_gateway.id
  resource_id   = aws_api_gateway_resource.resource_root.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "gateway_integration" {
  rest_api_id = aws_api_gateway_rest_api.gff_gateway.id
  resource_id = aws_api_gateway_resource.resource_root.id
  http_method = aws_api_gateway_method.get.http_method

  type                    = "HTTP"
  integration_http_method = "GET"
  uri                     = "https://apigff.com"
}

resource "aws_api_gateway_deployment" "gateway_deployment" {
  depends_on = [aws_api_gateway_integration.gateway_integration]
  rest_api_id = aws_api_gateway_rest_api.gff_gateway.id
  stage_name = "stage-dev"
}