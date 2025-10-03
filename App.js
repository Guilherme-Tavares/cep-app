import { View } from 'react-native';
import Address from './components/Address';
import styles from './styles';

export default function App() {
  return (
    <View style={styles.container}>
      <Address/>
    </View>
  );
}