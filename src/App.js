import React, { useState, useEffect } from 'react'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import api from './services/api'

export default function App() {
  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    api
      .get('repositories')
      .then(({ data }) => {
        setRepositories(data)
      })
      .catch((error) => console.log(error))
  }, [])

  async function handleLikeRepository(id) {
    api
      .post(`repositories/${id}/like`)
      .then(() => {
        const repositoryIndex = repositories.findIndex(
          (repository) => repository.id === id
        )
        repositories[repositoryIndex].likes++
        setRepositories([...repositories])
      })
      .catch((error) => console.log(error))
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer} key={repository.id}>
              <Text style={styles.repository}>{repository.title}</Text>
              <View style={styles.techsContainer}>
                {repository.techs.map((tech, index) => (
                  <Text style={styles.tech} key={index}>
                    {tech}
                  </Text>
                ))}
              </View>
              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#7159c1',
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  techsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    backgroundColor: '#04d361',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#fff',
    borderRadius: 4,
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#7159c1',
    padding: 15,
    borderRadius: 4,
  },
})
