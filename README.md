# Vai — amostra de passageiro / Novo Hamburgo

PWA estático, sem instalação de dependências ou etapa de build. Nome e identidade provisórios. Implementação web nova, inspirada no fluxo de mapa e busca apresentado no xUber; não é uma extração direta de Xamarin.

## Executar
No terminal, dentro desta pasta:

```sh
python3 -m http.server 8000
```

Abra http://localhost:8000. Em Codespaces, abra a porta 8000 pelo endereço HTTPS encaminhado. No celular, use o endereço HTTPS, não o arquivo HTML baixado. Para publicar como Preview na Vercel, use projeto estático (Other), sem build, diretório de saída `.`. Não exige chave de API.

## Escopo
- Entrada demonstrativa por nome, sem senha e sem autenticação real.
- Mapa Leaflet com tiles OpenStreetMap e atribuição visível.
- Busca local por nome ou endereço entre os três destinos cadastrados, tolerante a acentos.
- Localização real sob demanda usando getCurrentPosition. Requer HTTPS/localhost, permissão do navegador e localização ativada no aparelho. Não há rastreamento em segundo plano.
- Posição e nome ficam apenas em memória e são apagados ao sair/recarregar. Não há servidor de dados. O provedor do mapa recebe requisições dos tiles da região visualizada.
- Se a permissão for negada, escolha o ponto de embarque tocando no mapa.
- Seleção e confirmação de destino demonstrativas. Sem corrida, motorista, preço ou cálculo de rota.
- Manifesto, ícones e service worker para instalação. No Chrome Android, use o menu Instalar app/Adicionar à tela inicial ou o botão Instalar quando disponível. No Safari iOS, use Compartilhar > Adicionar à Tela de Início.
- A interface e a lista podem abrir offline após a primeira visita; o mapa requer internet. Não há download de mapas offline.

## Destinos e fontes (consulta em 30/09/2026)
1. Bourbon Shopping Novo Hamburgo — Av. Nações Unidas, 2001. Coordenadas de referência: -29.685917792, -51.133966161.
   https://www.waze.com/pt-BR/live-map/directions/bourbon-shopping-av.-nacoes-unidas-2001-novo-hamburgo?to=place.w.202442207.2024225463.472030
2. Estação Novo Hamburgo — Av. Nações Unidas, 2040. Coordenadas de referência: -29.68676, -51.1329.
   https://www.gov.br/trensurb/pt-br/servicos/Carta_de_Servicos_ao_Usuario_2026_rev04.pdf
   https://mapcarta.com/pt/N5317023262
3. Atacadão Novo Hamburgo — Av. Primeiro de Março, 2711. Coordenadas de referência: -29.707721702, -51.136446555.
   https://www.waze.com/pt-BR/live-map/directions/atacadao-r.-1o-de-marco-2711-novo-hamburgo?to=place.w.202442207.2024159925.2770838

Os pontos representam os estabelecimentos, não entradas de embarque auditadas em campo. O Waze usa Rua Primeiro de Março; cadastros empresariais usam Avenida Primeiro de Março no mesmo número.

## Dependências e evolução
Leaflet 1.9.4 distribuído em vendor (licença em vendor/LICENSE). OpenStreetMap é utilizado apenas para a amostra; respeitar https://operations.osmfoundation.org/policies/tiles/ e contratar dimensionamento/provedor adequado antes de ampliar o uso. Não há geocodificação externa nem busca livre na cidade nesta etapa. Para produção: autenticação, backend, privacidade, serviço de mapas dimensionado e demais regras do negócio.
