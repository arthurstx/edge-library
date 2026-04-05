

resource "cloudflare_record" "www" {
  content = "arthurstx.me"
  name    = "www"
  proxied = true
  ttl     = 1
  type    = "CNAME"
  zone_id = var.cloudflare_zone_id
}

resource "cloudflare_record" "worker_api" {
  content = "${var.worker_script_name}.workers.dev"
  name    = "api"
  proxied = true
  ttl     = 1
  type    = "CNAME"
  zone_id = var.cloudflare_zone_id
}