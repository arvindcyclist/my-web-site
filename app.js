const log = console.log
document.querySelector('.hrm').addEventListener('click', function(){
    let serviceUuid = 'heart_rate'
    if (serviceUuid.startsWith('0x')) {
      serviceUuid = parseInt(serviceUuid);
    }
  
    let characteristicUuid = 'heart_rate_measurement'
    if (characteristicUuid.startsWith('0x')) {
      characteristicUuid = parseInt(characteristicUuid);
    }
  
    log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice({filters: [{services: [serviceUuid]}]})
    .then(device => {
      log('Connecting to GATT Server...');
      return device.gatt.connect();
    })
    .then(server => {
      log('Getting Service...', serviceUuid);
      return server.getPrimaryService(serviceUuid);
    })
    .then(service => {
      log('Getting Characteristic...', characteristicUuid);
      return service.getCharacteristic(characteristicUuid);
    })
    .then(notify=>notify.startNotifications())
    .then(characteristic => {
        characteristic.addEventListener('characteristicvaluechanged', handlePowerCharacteristicValueChanged)
      })
    .catch(error => {
      log('Argh! ' + error);
    });
  
})

function handlePowerCharacteristicValueChanged(event){
  document.querySelector('.hr').textContent = event.target.value.getUint8(1)
  // for(let i=0;i<=7;i++){
  //   console.log("index is"+i+" "+event.target.value.getUint8(i))
  // }
}
