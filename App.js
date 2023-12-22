  import { TouchableOpacity, StyleSheet, Text, View, TextInput, Button } from 'react-native';
  import React, { useState , useEffect} from 'react';
  import Icon from 'react-native-vector-icons/FontAwesome';

  export default function App() {

    const ip = '192.168.235.17';
    const [x, setX] = useState('');
    const [allx, setallX] = useState([]);

    const addx = async () => {
      try {
        const response = await fetch(`http://${ip}:3000/x`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            theText: x,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Erreur lors de l\'enregistrement de x');
        }
    
        const data = await response.json();
        console.log('Article enregistré avec succès:', data);
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de x:', error.message);
      }
    };
    


    const fetchX = async () => {
      try {
        const response = await fetch(`http://${ip}:3000/x`);
        const data = await response.json();
        setallX(data.x);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
      }
    };

    useEffect(() => {
      const intervalId = setInterval(async () => {
        await fetchX();
      }, 1000);

      fetchX();
      return () => clearInterval(intervalId);
    }, []);


    const deleteX = async (xId) => {
              try {
                await fetch(`http://${ip}:3000/x/${xId}`, {
                  method: 'DELETE',
                });
                await fetchX();
              } catch (error) {
                console.error('Erreur lors de la suppression de l\'article:', error);
                setIsLoading(false);
              }
            };




    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
        <Text >Titre :</Text>
          <TextInput
            placeholder="add x here"
            value={x}
            onChangeText={setX}
          />
        </View>
        <Button title="Add" onPress={addx} />


        {(
      allx.map((x) => (
        <View key={x._id} >
            <Text style={styles.text} >{x.theText}</Text>
            <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteX(x._id)}
          >
           <Icon name="trash" size={20} color="white" />
          </TouchableOpacity>
        </View>
      ))
    )}
      
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: 'black',
      marginBottom: 30,
    },
    deleteButton: {
      position: 'absolute',
      top: 10,
      right: -70,
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
    },
  });
