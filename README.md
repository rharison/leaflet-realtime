# Leaflet realtime

* Este projeto de estudo que teve como propósito criar um client que irá se comunicar com um servidor que está realizando o trabalho de web-scaping. O servidor de web-scraping estará coletando dados de diversos locais, entre os dados temos a informação de altitude e longitude, com isso este client consome os dados coletados e insere uma marcação no mapa (alfinete) para cada local que já foi coletado.

* A comunicação com o servidor é feito de duas formas:
  * 1 - Via fetch (http) que é feito quando o projeto é inciado para buscar todos os locais já coletados até o momento;
  * 2 - Via web socket, o servidor informa o client toda vez que ele encontra um local novo e envia os dados para inserir a nova marcação.


### Iniciar projeto

--> npm i
--> npm run dev

### Técnologias utilizadas

- Leaflet
- React
- Vite
- Socket.io
- React-leaflet
