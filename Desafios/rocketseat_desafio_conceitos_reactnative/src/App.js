import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StatusBar, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import api from './services/api';

const App = () => {
    const [repositories, setRepositories] = useState([]);

    const orderRepository = (repo) => {
        return repo.sort((a, b) => a.id.localeCompare(b.id));
    };

    const initialCall = async () => {
        const repos = await api.get('/repositories');
        setRepositories(orderRepository(repos.data));
    };

    useEffect(() => {
        initialCall();
    }, []);

    const handleLikeRepository = async (id) => {
        // Implement "Like Repository" functionality
        const likedRepository = await api.post(`/repositories/${id}/like`);

        if (likedRepository.status === 200 || likedRepository.status === 204) {
            const tempRepos = repositories.filter((repo) => repo.id !== likedRepository.data.id);
            tempRepos.push(likedRepository.data);
            setRepositories(orderRepository(tempRepos));
        }
    };

    return (
        <>
            <StatusBar barStyle='light-content' backgroundColor='#7159c1' />

            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.repositoryContainer}>
                        {repositories.map((repo) => {
                            return (
                                <View key={repo.id}>
                                    <Text style={styles.repository}>{repo.title}</Text>

                                    <View style={styles.techsContainer}>
                                        {repo.techs.map((tech, index) => (
                                            <Text key={index} style={styles.tech}>
                                                {tech}
                                            </Text>
                                        ))}
                                    </View>

                                    <View style={styles.likesContainer}>
                                        <Text style={styles.likeText} testID={`repository-likes-${repo.id}`}>
                                            {repo.likes} {repo.likes > 1 ? 'curtidas' : 'curtida'}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        activeOpacity={0.75}
                                        style={styles.button}
                                        onPress={() => handleLikeRepository(repo.id)}
                                        testID={`like-button-${repo.id}`}
                                    >
                                        <Text style={styles.buttonText}>Curtir</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7159c1',
    },
    repositoryContainer: {
        marginBottom: 15,
        marginHorizontal: 15,
        backgroundColor: '#fff',
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
    },
});
