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

// Variáveis
var hora,
  temperatura = 0,
  meteorologia = 'Vento Gelado';

/*
 * Initialização de objetos e variáveis
 */
const client = new Discord.Client();
const prefix = process.env.PREFIX;

// Quando o bot estiver pronto
client.on('ready', () => {
  console.log('Bot pronto!');
});

/*
 * Funções periódicas
 */

// Código para o relógio personalizado
// https://stackoverflow.com/a/14431819

// function Clock() {
//   var clock = this;
//   var timeout;
//   var time;

//   this.hours = 0;
//   this.minutes = 0;
//   this.seconds = 0;
//   this.stop = stop;
//   this.start = start;

//   function stop() {
//     clearTimeout(timeout);
//   }

//   function start() {
//     timeout = setTimeout(tick, 0);
//     time = Date.now();
//   }

//   function tick() {
//     time += 25;
//     timeout = setTimeout(tick, time - Date.now());
//     display();
//     update();
//   }

//   function display() {
//     var hours = clock.hours;
//     var minutes = clock.minutes;

//     hours = hours < 10 ? '00' + hours : '' + hours;
//     minutes = minutes < 10 ? '00' + minutes : '' + minutes;
//   }

//   function update() {
//     var seconds = (clock.seconds += 4);

//     if (seconds === 60) {
//       clock.seconds = 0;
//       var minutes = ++clock.minutes;

//       if (minutes === 60) {
//         clock.minutes = 0;
//         var hours = ++clock.hours;

//         if (hours === 24) clock.hours = 0;
//       }
//     }
//   }
// }

// var relogio = new Clock();
// relogio.start();

function atualizarHora() {
  hora = moment()
    .subtract(process.env.DIF_HORAS, 'hour')
    .format('LT');
  client.user.setActivity(`Hora: ${hora}`);
  // console.log(hora);
}

function enviarMensagem() {
  const mensagemAuto = new Discord.RichEmbed()
    .setColor('#77185e')
    .setTitle('Informações Gerais')
    .setAuthor('Mr. Time', 'https://i.imgur.com/3ZDiLHR.png', 'https://github.com/afonsosantos')
    .setThumbnail('https://i.imgur.com/2r3EbTF.png')
    .addField('Hora', `São ${hora}`, true)
    .addField('Meteorologia', `${meteorologia}`, true)
    .addField('Temperatura', `Estão ${temperatura} graus`)
    .setTimestamp()
    .setFooter('Bot por Afonso Santos', 'https://i.imgur.com/1LHooWF.png');

  client.channels.get(process.env.ID_CANAL_MENSAGEM_AUTO).send(mensagemAuto);
  console.log('Mensagem automática enviada!');
}

// Hora e Custom Presence
setInterval(atualizarHora, process.env.INTERVAL_UPDATE_HORA);
setInterval(enviarMensagem, process.env.INTERVAL_ENVIO_MENSAGEM);

/*
 * Embeds
 */
const ajuda = new Discord.RichEmbed()
  .setColor('#77185e')
  .setTitle('Lista de Comandos')
  .setAuthor('Mr. Time', 'https://i.imgur.com/3ZDiLHR.png', 'https://github.com/afonsosantos')
  .setDescription('Lista de comandos disponíveis')
  .setThumbnail('https://i.imgur.com/2r3EbTF.png')
  .addField(`**${prefix}hora**`, 'Mostra a hora atual')
  .addField(`**${prefix}temp**`, 'Mostra a temperatura atual')
  .addField(`**${prefix}meteo**`, 'Mostra a meteorologia atual')
  .addField(`**${prefix}defmeteo**`, 'Define uma temperatura e meteorologia (args: <temp> <meteorologia>)')
  .addField(`**${prefix}auto**`, 'Mostra uma mensagem com a hora, meteorologia e temperatura')
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
    // Verifica se a mensagem tem os argumentos
    if (!args.length) {
      return message.channel.send(`Tem de especificar qual a temperatura e a meteorologia para definir ${message.author}!`);
    }
    temperatura = args[0];
    meteorologia = args[1];
    message.channel.send(`Temperatura definida para **${temperatura} ºC** e **${meteorologia}** como meteorologia.`);
  } else if (message.content.startsWith(prefix + 'ajuda')) {
    message.channel.send(ajuda);
  } else if (message.content.startsWith(prefix + 'auto')) {
    enviarMensagem();
  } else {
    // Opção padrão
    message.channel.send(`${message.author}, esse comando não existe. **${prefix}ajuda** para uma lista de comandos`);
  }
});

// Login
client.login();
