# IGTI - Desafio Final
## Aplicação para controle financeiro pessoal

### Configuração local

    $ sudo mkdir -p /storage/docker/finance-control/mongodb-data

    $ docker run --name docker-financecontrol -v /storage/docker/finance-control/mongodb-data:/data/db -p 27017:27017 -d mongo

    $ cd igti-finance-control && yarn install && cd client && yarn install && cd ..

    $ yarn server

    $ cd client && yarn start

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=IGTI%20Finance%20Control&uri=https%3A%2F%2Fgist.githubusercontent.com%2FGabrielCC163%2Fabeef35f15a0f3c17fe6acc72d33786e%2Fraw%2Feb1fe49078ff37c7d30c538146e34da3c85ab16b%2Figti_finance_control_requests.json)

Projeto base: http://fake-desafio-final.herokuapp.com/
