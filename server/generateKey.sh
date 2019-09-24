ssh-keygen -t rsa -b 4096 -N '' -f private.key
openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
    -subj "/C=NL/O=ZH/OU=Certificate/CN=*.cardsagainst.me" \
    -keyout key.pem  -out server.cert
