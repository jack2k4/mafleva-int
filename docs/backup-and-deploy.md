# Backup and Deployment Strategy

This project can support automatic backups, but the exact setup depends on the hosting provider and the database used in production.

## Recommended baseline

- Run the frontend behind HTTPS only.
- Keep the backend behind a reverse proxy that terminates SSL.
- Store production data in a managed database instead of in-memory arrays.
- Schedule daily automated backups for the database.
- Store backups in a separate region or account.
- Keep at least 7 daily backups, 4 weekly backups, and 6 monthly backups.

## Database backup options

### MongoDB Atlas
- Enable Atlas automated backups.
- Turn on point-in-time recovery for the production cluster.
- Restrict access with IP allowlisting and strong database credentials.

### Self-hosted MongoDB
- Use `mongodump` on a cron schedule.
- Compress dumps before uploading them to object storage such as S3, Backblaze B2, or Azure Blob Storage.
- Test restore jobs monthly with `mongorestore`.

### Managed SQL hosting
- Use provider-native automated backups if available.
- Export a weekly full dump to object storage as a second copy.

## Application file backup

- Back up `.env` values through the hosting dashboard or secret manager.
- Back up uploaded product images and media to object storage.
- Keep source code in Git with tagged release versions.

## SSL security

- Use the hosting provider's free SSL certificate or Let's Encrypt.
- Force HTTPS redirects at the proxy or CDN layer.
- Set secure headers at the backend using Helmet.

## Monitoring

- Alert on backup failures.
- Alert on low disk space.
- Alert on 5xx error spikes.
- Monitor inventory alerts through the admin dashboard and backend inventory endpoint.

## Next implementation step

To make this fully automatic in production, wire the app to:
- A hosted database
- Object storage for media
- A scheduled backup job or provider-native backups
- A deployment platform with enforced HTTPS
