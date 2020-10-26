import { Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import styled from 'styled-components/native';
import { IProviders } from '.';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  padding-top: ${Platform.OS === 'ios' ? getStatusBarHeight() + 24 : 24}px;
  background-color: #28262e;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  line-height: 28px;
`;

export const UserName = styled.Text`
  color: #ff9000;
  font-family: 'RobotoSlab-Medium';
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  height: 56px;
  width: 56px;
  border-radius: 28px;
`;

export const ProviderList = styled(FlatList as new () => FlatList<IProviders>)`
  padding: 32px 24px 16px;
`;

export const ProviderContainer = styled.View`
  background: #3e3b47;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
`;

export const ProviderAvatar = styled.Image`
  width: 72px;
  height: 72px;
  border-radius: 36px;
`;

export const ProviderInfo = styled.View`
  flex: 1;
  margin-left: 20px;
`;

export const ProviderName = styled.Text`
  font-family: 'RobotoSlab-Regular';
`;
export const ProviderMeta = styled.View``;
export const ProviderMetaText = styled.Text``;
