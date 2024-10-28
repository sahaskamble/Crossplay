import { Alert, Button, Modal, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { API_URL } from '@/constants/url';
import { Picker } from '@react-native-picker/picker';

export default function HomeScreen() {

  const [Devices, setDevices]: any = useState([]);
  const [Types, setTypes]: any = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [Name, setName] = useState('');
  const [Contact, setContact] = useState('');
  const [deviceName, setdeviceName] = useState('');
  const [todaysDate, settodaysDate] = useState('')
  const [hours, sethours] = useState(0);
  const [in_time, setin_time] = useState('');
  const [out_time, setout_time] = useState('');
  const [discount, setdiscount] = useState('');
  const [noOfPlayers, setnoOfPlayers] = useState(0);
  const [Snacks, setSnacks] = useState(0);
  const [WaterBottle, setWaterBottle] = useState(0);

  async function handleFetchDevicesandTypes() {
    setRefreshing(true);
    try {

      const devices = await fetch(`${API_URL}/api/devices/fetch`);
      const types = await fetch(`${API_URL}/api/device_types/fetch`);

      if (devices.ok) {
        const data = await devices.json();
        setDevices(data.output);
      }

      if (types.ok) {
        const data = await types.json();
        const reversed = data.output;
        setTypes(reversed.reverse());
      }

      setTimeout(() => {
        setRefreshing(false);
      }, 1500);

    } catch (e: any) {
      throw console.log(e);
    }
  }

  async function handleDisableDevice(id: any) {
    try {

      const res = await fetch(`${API_URL}/api/devices/edit/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "device_id": id,
          "status": "Inactive"
        }),
      });

      if (res.ok) {
        // const data = await res.json();
        Alert.alert('Device is In-Activated');
      } else {
        Alert.alert('Failed to Delete');
      }

    } catch (e: any) {
      throw console.error(e);
    }
  }

  async function handleAddSession() {
    try {

      const session = await fetch(`${API_URL}/api/gaming_session/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "customer_name": Name,
          "customer_contact": Contact,
          "device_name": deviceName,
          "date": "23rd Oct 2024",
          "hours": 2,
          "in_time": "10 am",
          "out_time": "12 am",
          "discount": "Happy Hours",
          "no_of_players": 3,
          "snacks": 2,
          "water_bottles": 1
        }),
      });

      if (session.ok) {
        Alert.alert('Session Added');
      } else {
        Alert.alert('Failed to add Session');
      }

    } catch (e: any) {
      throw console.error(e);
    }
  }

  useEffect(() => {
    handleFetchDevicesandTypes();
  }, [])

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleFetchDevicesandTypes} />
        }
      >
        {
          Types?.map((type: any, index: any) => (
            <View
              key={index}
              style={{ padding: 10, }}
            >
              <Text
                style={{ padding: 15, borderRadius: 10, marginBottom: 20, backgroundColor: '#449ae1', color: '#fff', fontSize: 18 }}
              >{type.CategoryName}</Text>
              <View
                style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 15 }}
              >
                {
                  Devices.filter((d: any) => d.CategoryId === type?.id).map((device: any, index: any) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        display: device.Status === 'Inactive' ? 'none' : 'flex',
                        width: 100,
                        height: 100,
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 8,
                      }}
                      onLongPress={() => { handleDisableDevice(device.id) }}
                      onPress={() => { setisModalOpen(true); setdeviceName(device.DeviceName) }}
                    >
                      <Text style={{ fontSize: 16 }}>{device.DeviceName}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </View>
          ))
        }
      </ScrollView>
      <Modal
        visible={isModalOpen}
        animationType='slide'
        onRequestClose={() => { setisModalOpen(false) }}
      >
        <Text style={{ fontSize: 18 }}>Add here:-</Text>
        <ScrollView
          contentContainerStyle={{ width: '100%', padding: 25, gap: 20 }}
        >
          <TextInput
            value={Name}
            onChangeText={(e) => { setName(e) }}
            style={{ fontSize: 20, padding: 10, borderColor: 'gray', borderWidth: 1 }}
          />

          <TextInput
            value={Contact}
            onChangeText={(e) => { setContact(e) }}
            style={{ fontSize: 20, padding: 10, borderColor: 'gray', borderWidth: 1 }}
          />

          <TextInput
            value={deviceName}
            style={{ fontSize: 20, padding: 10, borderColor: 'gray', borderWidth: 1 }}
          />

          <TouchableOpacity
            style={{ padding: 10, borderColor: 'gray', borderWidth: 1 }}
          >
            <Text>{todaysDate}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ padding: 10, borderColor: 'gray', borderWidth: 1 }}
          >
            <Text>{todaysDate}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ padding: 10, borderColor: 'gray', borderWidth: 1 }}
          >
            <Text>{todaysDate}</Text>
          </TouchableOpacity>

          <Button title='Add' onPress={handleAddSession} />
        </ScrollView>
      </Modal>
    </>
  );
}

// const styles = StyleSheet.create({
// });
//
// <Picker
//   selectedValue={discount}
//   onValueChange={(item: any) => setdiscount(item)}
// >
//   <Picker.Item label='None' value={'None'} />
//   <Picker.Item label='Happy Hours' value={'Happy Hours'} />
// </Picker>

