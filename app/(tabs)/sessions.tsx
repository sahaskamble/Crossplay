import { View, Text, Alert, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_URL } from '@/constants/url';

export default function SessionsScreen() {

  const [Sessions, setSessions]: any = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function handleFetchSessions() {
    setRefreshing(true)
    try {

      const sessions = await fetch(`${API_URL}/api/gaming_session/fetch/open`);

      if (sessions.ok) {
        const data = await sessions.json();
        setSessions(data.output);
      } else {
        Alert.alert('Failed to fetch data');
      }

      setRefreshing(false);
    } catch (e: any) {
      throw console.error(e);
    }
  }

  async function handleSessionClosed(id: any) {
    try {

      const closed = await fetch(`${API_URL}/api/gaming_session/close`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "session_id": id
        }),
      });

      if (closed.ok) {
        const data = await closed.json();
        Alert.alert("Session Closed");
      } else {
        Alert.alert("Failed to Close Session");
      }

    } catch (e: any) {
      throw console.error(e);
    }
  }

  useEffect(() => {
    handleFetchSessions();
  }, [])

  return (
    <ScrollView
      contentContainerStyle={{ padding: 15, }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleFetchSessions} />
      }
    >
      {
        Sessions?.map((items: any, index: any) => (
          <View
            key={index}
            style={{ backgroundColor: '#fff', elevation: 8, padding: 15, borderRadius: 10 }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 19 }}>Name :- {items.CustomerName}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 19 }}>In time :- {items.InTime}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 19 }}>Out time :- {items.OutTime}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 19 }}>Snacks :- {items.Snacks}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 19 }}>Price :- {items.SessionPrice}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 19 }}>Status :- <Text style={{ color: items.Status === 'Open' ? 'green' : (items.Status === 'Extended' ? 'yellow' : (items.Status === 'Closed' ? 'red' : 'black')) }}>{items.Status}</Text></Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}
            >
              <TouchableOpacity
                style={{ width: 100, alignItems: 'center', backgroundColor: '#449ae1', padding: 10, borderRadius: 10 }}
              >
                <Text style={{ color: '#fff' }}>Extend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: 100, alignItems: 'center', backgroundColor: 'red', padding: 10, borderRadius: 10 }}
                onPress={() => { handleSessionClosed(items.id) }}
              >
                <Text style={{ color: '#fff' }}>Closed</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      }
    </ScrollView>
  )
}
