/**
 * RelogioParadise
 * Simple bot that shows a clock and temperature for a RP Discord server
 *
 * Afonso Santos - 2019
 */

/*
 * Importação de pacotes NPM
 */
const Discord = require('discord.js');
var moment = require('moment');
moment.locale('pt');
require('dotenv').config();
var hora, temperatura, meteorologia;

/*
 * Initialização de objetos e variáveis
 */
const client = new Discord.Client();
const prefix = process.env.PREFIX;

// Quando o bot estiver pronto
client.on('ready', () => {
  // Envia uma mensagem para a consola
  console.log('Bot pronto!');
});

/*
 * Funções periódicas
 */

function atualizarHora() {
  hora = moment()
    .subtract(process.env.DIF_HORAS, 'hour')
    .format('LT');
  client.user.setActivity('Hora: ' + hora);
  // console.log(hora);
}

// Hora e Custom Presence
setInterval(atualizarHora, 5000);

/*
 * Embeds
 */
const ajuda = new Discord.RichEmbed()
  .setColor('#0099ff') // verificar cor
  .setTitle('Lista de Comandos')
  .setAuthor(
    'RelogioParadise',
    'https://media.discordapp.net/attachments/512212787716554764/638693611491426341/0f7d55e9dfcbbd436074545b17aff479.png',
    'https://github.com/afonsosantos'
  ) // logo do bot
  .setDescription('Lista de comandos disponíveis')
  .setThumbnail('https://media.discordapp.net/attachments/512212787716554764/638693611491426341/0f7d55e9dfcbbd436074545b17aff479.png') // logo do bot
  .addField(`**${prefix}hora**`, 'Mostra a hora atual')
  .addField(`**${prefix}temp**`, 'Mostra a temperatura atual')
  .addField(`**${prefix}deftemp**`, 'Define uma temperatura (args: <temp>)')
  .addField(`**${prefix}ajuda**`, 'Mostra esta mensagem')
  .setTimestamp()
  .setFooter('Bot por Afonso Santos', 'https://i.imgur.com/1LHooWF.png');

/*
 * Lista de Comandos
 */
client.on('message', message => {
  // Exit and stop if it's not there
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  if (message.content.startsWith(prefix + 'hora')) {
    message.channel.send(`Hora Atual: **${hora}**`);
  } else if (message.content.startsWith(prefix + 'temp')) {
    message.channel.send(`Temperatura: **${temperatura} ºC**`);
  } else if (command == 'deftemp') {
    // Verifica se a mensagem tem os argumentos necessários
    if (!args.length) {
      return message.channel.send(`Tem de especificar qual a temperatura e a meteorologia para definir ${message.author}!`);
    }
    temperatura = args[0];
    meteorologia = args[1];
    message.channel.send(`Temperatura definida para **${temperatura} ºC** e ${meteorologia}`);
  } else if (message.content.startsWith(prefix + 'ajuda')) {
    message.channel.send(ajuda);
  }
});

// Login
client.login();
