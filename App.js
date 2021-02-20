import React, { Component } from 'react';
import { SafeAreaView, View, Text, Dimensions , FlatList, TextInput, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import firebase from "firebase";

class ChatScreen extends React.Component<Props> {
  
  state = {
    arr: [],
    message: "",
    username: "",
    password: "",
    loginCheck: '',
    FlatListRef : null,
    TextInputRef: '',
    isVisible: true,
  };

  componentDidMount() {
    firebase.database().ref('messages/').on('child_added', value => {
      const obj = {'key': value.key, 'name': value.val().name, 'message': value.val().text}
      this.setState(prevState => {
        const arr = this.state.arr.concat(obj)
        return {arr}
      });
    })
  }
  
  componentWillUnmount() {
    firebase.database().ref('messages/').off();
  }

  loginModal = (show) =>{
    firebase.database().ref('users/').on('child_added', value => {
      if(value.val().name == this.state.username){
        if(value.val().password == this.state.password){
          this.setState({loginCheck: 'Giriş Başarılı...'})
          setTimeout(() => {this.setState({isVisible: show})}, 2000)//2sn sonra modalı kapat
        }else{
          this.setState({loginCheck: 'Giriş Başarsız...'})
        }
      }
    })
  }

  render() {
    writeUserData = () => {
      firebase.database().ref('messages').push({
        name: this.state.username,
        text: this.state.message
      })
      this.TextInputRef.clear()
    }

    return (
      <SafeAreaView style={styles.body}>
        <Modal
          animationType = {"slide"}
          transparent={true}
          visible={this.state.isVisible}
        >
          <View style={styles.loginModal}>
              <Text style={styles.loginCheckText}>{this.state.loginCheck}</Text>
              <Text style={styles.loginTitle}>Hello.{"\n"}Welcome Back</Text>
              <View>
                <Text style={styles.loginLabel}>USERNAME</Text>
                <TextInput
                    style={styles.loginInpt}
                    onChangeText={(text) => this.state.username = text}
                    placeholder="username21"
                />
              </View>
              <View>
                <Text style={styles.loginLabel}>PASSWORD</Text>
                <TextInput
                    style={styles.loginInpt}
                    onChangeText={(text) => this.state.password = text}
                    placeholder="****************"
                />
              </View>
              <Text 
                style={styles.loginBtn}
                onPress={() => {this.loginModal(!this.state.isVisible);}}
              >
                  LOGIN
              </Text>
          </View>
        </Modal>

        <View style={styles.msgviewBox}>
            <FlatList
              ref={ (ref) => { this.FlatListRef = ref } }
              onContentSizeChange={() => {this.FlatListRef.scrollToEnd()}}
              onLayout={() => {this.FlatListRef.scrollToEnd()}}
              style={styles.messageList}
              data={this.state.arr}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <View style={(item.name == this.state.username) ? styles.messageView2 : styles.messageView1}>
                  <Text style={styles.msgSubtitle}>{item.name}</Text>
                  <Text style={(item.name == this.state.username) ? styles.messageBox2 : styles.messageBox1}> 
                    {item.message}
                  </Text>
                </View>
              )}
            />
        </View>

        <View style={styles.sendBox}>
              <TextInput
                  ref={input => { this.TextInputRef = input }}
                  style={styles.inputBox}
                  onChangeText={(text) => this.state.message = text}
                  placeholder="Mesaj..."
              />
              <TouchableOpacity style={styles.sendBtn} onPress={writeUserData}>
                  <Image style={styles.btnIcon} source={require('./assets/image/send.png')} />
              </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#F3F6FF",
  },
  msgviewBox: {
    backgroundColor: "#F3F6FF",
    flex: 1, 
    paddingTop:10,
    paddingBottom:0
  },
  messageList: {
    backgroundColor: '#F3F6FF',
  },
  messageView1: {
    alignSelf: "flex-start",
  },
  messageView2: {
    alignSelf: "flex-end",
  },
  msgSubtitle: {
    marginHorizontal: 20,
    fontSize: 12,
    opacity: .6
  },
  messageBox1: {
    backgroundColor: "#8E91F4",
    color: "white",
    marginBottom: 15,
    marginRight: 10,
    marginLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    minWidth: 100,

    shadowColor: "gray",
    shadowOffset:{
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.13,
    shadowRadius: 2.62,
    elevation: 6,
  },
  messageBox2: {
    backgroundColor: "white",
    color: "black",
    marginBottom: 15,
    marginRight: 10,
    marginLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 16,
    borderBottomRightRadius: 0,
    minWidth: 100,

    shadowColor: "gray",
    shadowOffset:{
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.13,
    shadowRadius: 2.62,
    elevation: 12,
  },
  sendBox: {
    height: 85,
    flexDirection:  "row",
    padding: 10,
    paddingBottom: 15,
    backgroundColor: "white",
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    shadowColor: "black",
    shadowOffset:{
    width: 0,
    height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 12,
  },
  inputBox: {
    flex: 1,
    height: 50,
    margin: 5,
    padding: 15,
    backgroundColor: "#F3F4F6",
    borderRadius: 500,
    borderWidth: 0,
    borderColor: "black",
  },
  sendBtn: {
    width: 50,
    height: 40,
    backgroundColor: "#8E91F4",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 500,
    position: "absolute",
    right: 22,
    top: 20
  },
  btnIcon: {
    width: 30,
    height: 17,
  },
  loginModal: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F6FF"
  },
  loginTitle: {
    width: 275,
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 32
  },
  loginLabel: {
    marginTop: 32,
    width: 275,
    color: "gray"
  },
  loginInpt: {
    width: 275,
    marginTop: 10,
    paddingHorizontal: 0,
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderColor: "#D7D7D7",
  },
  loginBtn: {
    marginTop: 64,
    width: 275,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#8E91F4",
    color: "white",
    borderRadius: 8,
    textAlign: "center"
  },
  loginCheckText: {
    position: "absolute",
    top: 15,
    left: 15
  }
});

export default ChatScreen;