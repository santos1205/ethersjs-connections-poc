# Configuração do Botão de Mintar NFTs Iniciais

Para que o botão **Mintar** funcione corretamente e possa criar NFTs iniciais, o desenvolvedor precisa configurar o endereço da carteira onde os NFTs serão mintados. Siga os passos abaixo para realizar a configuração:

## Passo 1: Criar o arquivo `.env`

No diretório raiz do seu projeto, crie um arquivo chamado `.env` (caso não exista) e adicione a variável de ambiente com o endereço da carteira.

Exemplo:

```env
REACT_APP_WALLET_ADDRESS=0xSeuEnderecoDeCarteiraAqui
