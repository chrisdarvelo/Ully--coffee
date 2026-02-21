import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../utils/constants';

interface CoffeeFlowerProps {
  size?: number;
  spinning?: boolean;
  bold?: boolean;
  dark?: boolean;
  color?: string;
  opacity?: number;
}

/**
 * Premium "Signature" Coffee Blossom
 * Features layered petals with center-vein detail and a high-end gold cluster center.
 */
export default function CoffeeFlower({ 
  size = 150, 
  spinning = false, 
  bold = false, 
  dark = false,
  color,
  opacity = 1
}: CoffeeFlowerProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (spinning) {
      const spin = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        })
      );
      spin.start();
      return () => spin.stop();
    } else {
      Animated.spring(spinAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [spinning, spinAnim]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const strokeColor = color || (dark ? '#3C3228' : '#FFFFFF');
  const gold = Colors.primary;
  
  // High-end organic petal with a "crease" detail
  const petalPath = "M100,100 C115,80 140,65 100,15 C60,65 85,80 100,100 Z";
  const veinPath = "M100,100 L100,45"; // Delicate center line
  
  return (
    <View style={[styles.container, { width: size, height: size, opacity }]}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg 
          width={size} 
          height={size} 
          viewBox="0 0 200 200"
          fill="none"
        >
          <Defs>
            <LinearGradient id="petalGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={strokeColor} stopOpacity={0.9} />
              <Stop offset="100%" stopColor={strokeColor} stopOpacity={1} />
            </LinearGradient>
          </Defs>

          {/* 6 Layered Petals */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <G transform={`rotate(${angle}, 100, 100)`} key={angle}>
              {/* Petal Shadow/Glow */}
              <Path
                d={petalPath}
                fill="url(#petalGrad)"
                stroke={gold}
                strokeWidth={bold ? 1.5 : 0.8}
                strokeOpacity={0.4}
              />
              {/* Petal Vein */}
              <Path
                d={veinPath}
                stroke={gold}
                strokeWidth={0.5}
                strokeOpacity={0.6}
                strokeLinecap="round"
              />
            </G>
          ))}
          
          {/* Detailed Gold Cluster Center */}
          <Circle cx="100" cy="100" r="14" fill={gold} fillOpacity={0.15} />
          <Circle cx="100" cy="100" r="8" fill={gold} />
          
          {/* Premium Stamen Dots */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <Circle
              key={`stamen-${angle}`}
              cx={100 + 16 * Math.cos((angle * Math.PI) / 180)}
              cy={100 + 16 * Math.sin((angle * Math.PI) / 180)}
              r="2.2"
              fill={gold}
            />
          ))}

          {/* Inner Light Core */}
          <Circle cx="100" cy="100" r="3" fill={dark ? Colors.background : "#FFF"} />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
