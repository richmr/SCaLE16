# SCaLE16 Map
Interactive map website for various network monitoring objectives:

Don't know if you got zabbix up and running yet, but here is a web
>>>>
>>>> I
>>>>
>>>> Here's my plan
>>>> 1) Zabbix to do the basic monitoring. What data to collect and display
>>>> is still up in the air.
>>>>
>>>> 2) I would like to have a clickable map of the convention center,
>>>> maybe using images form here as background maps:
>>>> https://pasadenacenter.visitpasadena.com/facility/
>>>> https://pasadenacenter.visitpasadena.com/facility/exhibit-halls-ab/
>>>> https://pasadenacenter.visitpasadena.com/ballroom/
>>>> https://pasadenacenter.visitpasadena.com/facility/conference-center/
>>>> This will serve a couple of purposes.
>>>> A) During the setup, there will be an "edit" or "placement" mode where
>>>> when someone places an AP or switch, they need to login with there
>>>> phone/tablet/device, go to the monitor server, click on the network
>>>> device that they just placed (should come up semi quickly if
>>>> configured to register w/ zabbix), then it brings up a map where they
>>>> could click down to the room, then click where they placed the network
>>>> device.
>>>> B) During "monitor view", it's just a map with icons displaying
>>>> green/yellow/red, which when clicked, brings up the network device
>>>> zabbix host view/status/alerts.
>>>>
>>>> I believe this could be implemented with a simple php/javascript web
>>>> app. Then imported into a screen field in zabbix:
>>>>
>>>> https://www.zabbix.com/documentation/3.4/manual/config/visualisation/screens
>>>> We would have apache serving up something like mon.lan/map and have a
>>>> screen import that URL.
>>>>
>>>> 3) Another map, but a heat map this time. Show the number of clients
>>>> connect to each AP (and maybe switch if a lot of cable drops are
>>>> used). Was looking at heatmap.js (
>>>> https://www.patrick-wied.at/static/heatmapjs/ ) to do something like
>>>> this. We could query the zabbix database to get the number of clients
>>>> per AP. And this would be implemented as another javascript web app,
>>>> mon.lan/connections and imported into zabbix as a URL.
>>>>
>>>> 4) Heatmap of the AP signal strength. Different colors for each
>>>> channel, fading as far as signal goes down. Data drawn from what the
>>>> AP's see themselves, and maybe roaming tech crew measuring AP signal
>>>> strength with a signal strength app (I have mobile app  in mind
>>>> already, need to look up the name). Implemented as a web app also,
>>>> mon.lan/AP

