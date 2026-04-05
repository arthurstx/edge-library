resource "cloudflare_workers_secret" "jwt_secret" {
  account_id  = var.cloudflare_account_id
  script_name = var.worker_script_name        
  name        = "JWT_SECRET"
  secret_text = var.jwt_secret       
}