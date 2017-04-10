var sh = SmoothieHappy

console.info('SmoothieHappy - v' + sh.VERSION, sh);

// -----------------------------------------------------------------------------

// Board events shortcut
var topics = sh.board.boardTopics;

// Board instance
var board = newBoard(storeGet('address', '192.168.1.1'));

function newBoard(address) {
  var b = new sh.board.Board({ address: address });

  b.subscribe(topics.COMMAND_CREATE  , onCreate);
  b.subscribe(topics.COMMAND_SEND    , onSend);
  b.subscribe(topics.COMMAND_ERROR   , onError);
  b.subscribe(topics.COMMAND_RETRY   , onRetry);
  b.subscribe(topics.COMMAND_RESPONSE, onResponse);

  b.subscribe(topics.COMMAND_UPLOAD_ERROR    , onWarning);
  b.subscribe(topics.COMMAND_UPLOAD_TIMEOUT  , onWarning);
  b.subscribe(topics.COMMAND_DOWNLOAD_ERROR  , onWarning);
  b.subscribe(topics.COMMAND_DOWNLOAD_TIMEOUT, onWarning);

  b.subscribe(topics.COMMAND_QUEUE_CLEAR, onQueueClear);

  b.subscribe(topics.STATE_HALT , onStateHalt);
  b.subscribe(topics.STATE_CLEAR, onStateClear);

  updateCommandQueue(b);
  storeSet('address', address);

  return b;
}

// -----------------------------------------------------------------------------

function onCreate(event) {
  console.info('onCreate:', event);

  var cmd  = event.payload
  var args = cmd.commandArgs.length ? JSON.stringify(cmd.commandArgs) : ''
  var html = commandTemplate({
    uuid   : cmd.uuid,
    address: event.board.address,
    command: cmd.commandLine
  });

  updateCommandQueue(event.board);
  $console.append(html);
  scrollToBottom();
}

function onSend(event) {
  console.info('onSend:', event);

  var $command = $('#' + event.payload.uuid);

  $command.find('.pending').hide();
  $command.find('.loading').show();
  updateCommandQueue(event.board);
}

function onResponse(event) {
  console.info('onResponse:', event);

  var payload  = event.payload
  var cmd      = payload.request
  var $command = $('#' + cmd.uuid);
  var $body    = $command.find('.panel-body');
  var html     = $(jsonResponse(payload.payload.data));

  $body.html(html);
  scrollToBottom();
  Prism.highlightAll(html[0]);
  updateCommandQueue(event.board);
}

function error(type, event) {
  var payload  = event.payload
  var cmd      = payload.request
  var $command = $('#' + cmd.uuid);
  var $errors  = $command.find('.errors');
  var $error   = $('<li/>').addClass('list-group-item list-group-item-' + type);
  var $icon    = $('<i class="fa fa-fw fa-exclamation-triangle"></i>');

  $command.find('.retry').hide();
  $command.find('.loading').hide();
  $error.append($icon, ' ', payload.payload.message);
  $errors.append($error);
  updateCommandQueue(event.board);
}

function onError(event) {
  console.error('onError:', event);
  error('danger', event)
}

function onWarning(event) {
  console.warn('onWarning:', event);
  error('warning', event)
}

function onRetry(event) {
  console.info('onRetry:', event);

  var payload  = event.payload
  var cmd      = payload.request
  var $command = $('#' + cmd.uuid);
  var html     = retryTemplate(payload.payload);

  $command.find('.retry').replaceWith(html).show();
  updateCommandQueue(event.board);
}

function onQueueClear(event) {
  console.info('onQueueClear:', event);

  event.payload.forEach(function(cmd) {
    var $command = $('#' + cmd.uuid);

    $command.find('.pending').hide();
    $command.find('.loading').hide();
    $command.find('.retry').hide();
    $command.find('.cleared').show();
    $command.find('.panel-heading').css('text-decoration', 'line-through');
  })
}

function onStateHalt(event) {
  console.info('onStateHalt:', event);

  $systemHalted.modal('show');
  $('.navbar button.clearState').show();
}

function onStateClear(event) {
  console.info('onStateClear:', event);

  $systemHalted.modal('hide');
  $('.navbar button.clearState').hide();
}
