import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  View,
  Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

const DEFAULT_HOST = 'http://192.168.1.34:5035/';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [resolvedUrl, setResolvedUrl] = useState(DEFAULT_HOST);
  const [connectionError, setConnectionError] = useState(null);

  const candidateUrls = useMemo(() => {
    const urls = [];

    if (Platform.OS === 'android') {
      urls.push('http://10.0.2.2:5035/');
    } else if (Platform.OS === 'ios') {
      urls.push('http://127.0.0.1:5035/');
    } else {
      urls.push('http://localhost:5035/');
    }

    urls.push(DEFAULT_HOST);
    urls.push('http://172.20.144.1:5035/');
    return [...new Set(urls)];
  }, []);

  useEffect(() => {
    let cancelled = false;

    const tryResolveUrl = async () => {
      setIsLoading(true);
      setConnectionError(null);

      console.log('[BancoGP App] Iniciando prueba de conectividad...');
      console.log('[BancoGP App] URLs candidatas:', candidateUrls);

      for (const url of candidateUrls) {
        if (cancelled) return;

        console.log(`[BancoGP App] Probando: ${url}`);
        try {
          const response = await fetch(url, { 
            method: 'GET',
            timeout: 5000,
          });
          console.log(`[BancoGP App] Respuesta de ${url}: ${response.status}`);
          if (!cancelled && (response.ok || response.status < 500)) {
            console.log(`[BancoGP App] ✓ Conectado a: ${url}`);
            setResolvedUrl(url);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.log(`[BancoGP App] ✗ Error en ${url}:`, error.message);
          // continue to next candidate
        }
      }

      if (!cancelled) {
        console.log(`[BancoGP App] Todas las URLs fallaron. Usando DEFAULT_HOST: ${DEFAULT_HOST}`);
        setResolvedUrl(DEFAULT_HOST);
        setConnectionError(
          'No se pudo contactar al panel de BancoGP. Asegura que Vite sigue abierto en el puerto 5035.'
        );
        setIsLoading(false);
      }
    };

    tryResolveUrl();
    return () => {
      cancelled = true;
    };
  }, [candidateUrls, retryCount]);

  const handleWebViewError = (error) => {
    console.warn('WebView error:', error.nativeEvent);
    if (retryCount < 3) {
      setTimeout(() => setRetryCount((value) => value + 1), 2000);
    } else {
      setConnectionError(
        'La interfaz no pudo cargarse. Intenta recargar la app o revisar el servidor Vite.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003da5" />
      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: resolvedUrl }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          cacheEnabled={true}
          scrollEnabled={true}
          bounces={true}
          mixedContentMode="compatibility"
          originWhitelist={['*']}
          useWebKit={true}
          setSupportMultipleWindows={false}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={handleWebViewError}
          onHttpError={(error) => {
            console.warn('WebView HTTP error:', error.nativeEvent);
          }}
          scalesPageToFit={true}
          onMessage={(event) => {
            console.log('WebView message:', event.nativeEvent.data);
          }}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#003da5"
              style={styles.activityIndicator}
            />
            <Text style={styles.loadingText}>
              {resolvedUrl ? 'Cargando BancoGP...' : 'Conectando con el panel...'}
            </Text>
          </View>
        )}
        {connectionError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{connectionError}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003da5',
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 61, 165, 0.9)',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 14,
  },
  errorText: {
    color: '#003da5',
    fontSize: 14,
    textAlign: 'center',
  },
  activityIndicator: {
    transform: [{ scale: 1.5 }],
  },
});
