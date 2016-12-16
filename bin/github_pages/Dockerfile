# Docker for Jekyll
# Based on Hadi Hariri's docker file.
FROM alpine:latest
MAINTAINER Frank Quednau <fquednau@gmail.com>

# Install base, Ruby, Headers, Jekyll, Export Path and Clean Up
RUN apk update && apk upgrade && apk add curl wget bash && \
    apk add ruby ruby-bundler ruby-dev ruby-irb ruby-rdoc libatomic readline readline-dev \
    libxml2 libxml2-dev libxslt libxslt-dev zlib-dev zlib \
    libffi-dev build-base git nodejs && \
    export PATH="/root/.rbenv/bin:$PATH" && \
    rm -rf /var/cache/apk/* && \
    # Install Jekyll and required gems
    gem install github-pages