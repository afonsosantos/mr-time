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
var hora,
  temperatura = 0,
  meteorologia;

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
  client.user.setActivity(`Hora: ${hora}`);
  // console.log(hora);
}

// Hora e Custom Presence
setInterval(atualizarHora, process.env.INTERVAL_UPDATE_HORA);

/*
 * Embeds
 */
const ajuda = new Discord.RichEmbed()
  .setColor('#77185e')
  .setTitle('Lista de Comandos')
  .setAuthor('Mr. Time', 'https://i.imgur.com/3ZDiLHR.png', 'https://github.com/afonsosantos')
  .setDescription('Lista de comandos disponíveis')
  .setThumbnail('https://i.imgur.com/tJFOtNj.png')
  .addField(`**${prefix}hora**`, 'Mostra a hora atual')
  .addField(`**${prefix}temp**`, 'Mostra a temperatura atual')
  .addField(`**${prefix}meteo**`, 'Mostra a meteorologia atual')
  .addField(`**${prefix}defmeteo**`, 'Define uma temperatura e meteorologia (args: <temp> <meteorologia>)')
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
  } else if (message.content.startsWith(prefix + 'meteo')) {
    message.channel.send(`Meteorologia: **${meteorologia}**`);
  } else if (command == 'defmeteo') {
    // Verifica se a mensagem tem os argumentos necessários
    if (!args.length) {
      return message.channel.send(`Tem de especificar qual a temperatura e a meteorologia para definir ${message.author}!`);
    }
    temperatura = args[0];
    meteorologia = args[1];
    message.channel.send(`Temperatura definida para **${temperatura} ºC** e **${meteorologia}** como meteorologia.`);
  } else if (message.content.startsWith(prefix + 'ajuda')) {
    message.channel.send(ajuda);
  } else {
    // Opção padrão
    message.channel.send(`${message.author}, esse comando não existe. **${prefix}ajuda** para uma lista de comandos`);
  }
});

// Login
client.login();
