const timePicker = document.getElementById('timepicker');
const dataContainer = document.getElementById('dataContainer');

const insid = dataContainer.getAttribute('data-insid');
//const userid

const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
const appbtn = document.getElementById('appointmentButton');
let mymodal = new bootstrap.Modal(document.getElementById('appointmentModal'));
let appmodalclosebtn = document.getElementById('appmodalclose');
let time = [];
let flatpickrInstance;
let disableTimeRanges = [];
let appMap = {};
let disabledDates = [];
let formsub = document.getElementById('appsub');


const myModalEl = document.getElementById('appointmentModal')
myModalEl.addEventListener('hidden.bs.modal', event => {
 if (flatpickrInstance) {

  flatpickrInstance.clear();

 }

})
formsub.addEventListener('click', async function (e) {
 e.preventDefault();
 const service1 = document.getElementById('servicetype');
 const service2 = document.getElementById('servicetype2');
 let service = [];

 if (service1.checked) {
  service.push(service1.value);

 }
 if (service2.checked) {
  service.push(service2.value);

 }


 let date = document.getElementById('date').value;

 let timesub = document.getElementById('timepicker').value;
 if (!date || !timesub) {
  const toastText = document.getElementById('toastText');
  toastText.innerText = 'Please select a date and time';
  toastBootstrap.show();
  return;

 }
 const desc = document.getElementById('desc').value;

 let momentDate = new Date(date);

 const timePicked = moment(timesub, 'h:mm A');
 const hour = timePicked.hours();
 momentDate.setHours(hour);
 const minute = timePicked.minutes();
 momentDate.setMinutes(minute);


 getCheckedOptions();





 let appointmentTime = momentDate;

 let res = await axios.post(`/getapp/makeapp/6618ae9f3cb1bc6706814588/${insid}`, { appointmentTime, category: service, desc });
 const toastText = document.getElementById('toastText');


 toastText.innerText = 'Appointment has been made!';

 mymodal.hide();

 toastBootstrap.show();




});

initTimepicker();

async function getnewTime() {
 time = [];
 const applist = await axios.get(`/getapp/ins/${insid}`)
 for (const value of applist.data) {
  const appointment = await axios.get(`/getapp/${value}`)
  if (new Date(appointment.data.appointment_time) >= new Date()) {
   time.push(appointment.data.appointment_time);
  }
 }
}

appbtn.addEventListener('click', async function () {

 await getnewTime();
 time.forEach((value) => {
  if (!appMap[value]) {
   appMap[value] = 0;
  }
  appMap[value]++;

 });
 for (let key in appMap) {
  if (appMap[key] === 16) {
   disabledDates.push(key);
  }
 }

 initialflatpick();
});




async function initialflatpick() {
 if (flatpickrInstance) {
  flatpickrInstance.destroy();

 }





 flatpickrInstance = flatpickr('#date', {
  dateFormat: "m/d/Y",
  disable: disabledDates,
  minDate: "today",

  onChange: async function (selectedDates, dateStr, instance) {

   await getnewTime();


   await getdisableTimeRanges(selectedDates);

   initTimepicker();


  }
 });
}

async function getdisableTimeRanges(selectedDates) {
 let curDate = new Date(selectedDates[0]);
 let curapp = time.filter((value) => {
  let appDate = new Date(value);
  return appDate.getDate() === curDate.getDate() && appDate.getMonth() === curDate.getMonth() && appDate.getFullYear() === curDate.getFullYear();
 });
 disableTimeRanges = [];

 curapp.forEach((value) => {
  let disabletimedate = new moment(value);
  let appTime = disabletimedate.format('HH:mm');

  disabletimedate.add(30, 'minutes');
  let appTime2 = disabletimedate.format('HH:mm');

  disableTimeRanges.push([appTime, appTime2]);
 });


}

function initTimepicker() {

 $('#timepicker').timepicker('remove');
 $('#timepicker').timepicker({
  'disableTimeRanges': disableTimeRanges,
  'minTime': '9:00am',
  'maxTime': '4:30pm',
  'timeFormat': 'h:i A'
 });


}
function getCheckedOptions() {
 const options = [];
 const checkboxes = document.querySelectorAll('.form-check-input');

 checkboxes.forEach(checkbox => {
  if (checkbox.checked) {
   options.push(checkbox.value);
  }
 });

 console.log('Selected options:', options);
 return options;
}