# For the work laptop
docker run -v c:\dev\website:/tmp -p 4000:4000 rf:jekyll jekyll serve -s /tmp --host 0.0.0.0 --watch --incremental --force_polling
#docker exec -t -i container_name /bin/bash
