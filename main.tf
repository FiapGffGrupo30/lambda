terraform {
    required_version = ">=0.13.1"
    required_providers {
      aws = ">=5.22.0"
      local = ">=2.4.0"
    }
    backend "s3" {
      bucket = "bucket-gateway-gff"
      key    = "terraform.tfstate"
      region = "us-east-1"
    }
}

provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "existing_vpc" {
  filter {
    name   = "tag:Name"
    values = ["soat2-grupo-30-vpc"]
  }
}

data "aws_instances" "existing_instances" {
  instance_state_names = ["running"]
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.existing_vpc.id]
  }
}

module "api_gateway" {
  source = "./modules/gateway"
}