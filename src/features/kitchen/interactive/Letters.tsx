import { useEffect, useRef } from 'react';

import { Triplet } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

import { useAchievement } from '../../../api/hooks/useAchievement';
import { getState, setState, subscribe } from '../../../store/store';
import { AchievementName, GLTFResult } from '../../../types';

const tPresentationPos: Triplet = [0.53, 0.98, 5.95];
const tInitialPos: Triplet = [0.2, 0.35, -3.8];

const oPresentationPos: Triplet = [0.42, 0.98, 5.96];
const oInitialPos: Triplet = [-2.73, 0.82, -3.4];

const uPresentationPos: Triplet = [0.29, 0.98, 5.98];
const uInitialPos: Triplet = [2.29, 0.75, 0.245];

const kPresentationPos: Triplet = [0.23, 0.98, 5.97];
const kInitialPos: Triplet = [2.9, 1, -3.82];

export function Letters(): JSX.Element {
  const { nodes, materials } = useGLTF(
    '/letters.gltf'
  ) as unknown as GLTFResult;

  const tRef = useRef<Mesh>(null);
  const tRefCollected = useRef(getState().letters.t);
  useEffect(
    () =>
      subscribe((state) => {
        tRefCollected.current = state.letters.t;
      }),
    []
  );

  const oRef = useRef<Mesh>(null);
  const oRefCollected = useRef(getState().letters.o);
  useEffect(
    () =>
      subscribe((state) => {
        oRefCollected.current = state.letters.o;
      }),
    []
  );

  const uRef = useRef<Mesh>(null);
  const uRefCollected = useRef(getState().letters.u);
  useEffect(
    () =>
      subscribe((state) => {
        uRefCollected.current = state.letters.u;
      }),
    []
  );

  const kRef = useRef<Mesh>(null);
  const kRefCollected = useRef(getState().letters.k);
  useEffect(
    () =>
      subscribe((state) => {
        kRefCollected.current = state.letters.k;
      }),
    []
  );

  useFrame(() => {
    if (!tRefCollected.current && tRef.current) {
      tRef.current.rotation.y += 0.01;
    }

    if (!oRefCollected.current && oRef.current) {
      oRef.current.rotation.y += 0.01;
    }

    if (!uRefCollected.current && uRef.current) {
      uRef.current.rotation.y += 0.01;
    }

    if (!kRefCollected.current && kRef.current) {
      kRef.current.rotation.y += 0.01;
    }
  });

  const { addAchievement } = useAchievement();

  return (
    <group>
      <mesh
        ref={tRef}
        geometry={nodes.letterT.geometry}
        material={materials.toukLettersMaterial}
        position={tInitialPos}
        onClick={(e) => {
          e.stopPropagation();

          if (tRef.current) {
            tRef.current.position.set(...tPresentationPos);
            tRef.current.rotation.set(0, 0, 0);
            setState((state) => ({ letters: { ...state.letters, t: true } }));
            addAchievement(AchievementName.AT);
          }
        }}
      />
      <mesh
        ref={oRef}
        geometry={nodes.letterO.geometry}
        material={materials.toukLettersMaterial}
        position={oInitialPos}
        onClick={(e) => {
          e.stopPropagation();

          if (oRef.current) {
            oRef.current.position.set(...oPresentationPos);
            oRef.current.rotation.set(0, 0, 0);
            setState((state) => ({ letters: { ...state.letters, o: true } }));
            addAchievement(AchievementName.BO);
          }
        }}
      />
      <mesh
        ref={uRef}
        geometry={nodes.letterU.geometry}
        material={materials.toukLettersMaterial}
        position={uInitialPos}
        onClick={(e) => {
          e.stopPropagation();

          if (uRef.current) {
            uRef.current.position.set(...uPresentationPos);
            uRef.current.rotation.set(0, 0, 0);
            setState((state) => ({ letters: { ...state.letters, u: true } }));
            addAchievement(AchievementName.CU);
          }
        }}
      />
      <mesh
        ref={kRef}
        geometry={nodes.letterK.geometry}
        material={materials.toukLettersMaterial}
        position={kInitialPos}
        onClick={(e) => {
          e.stopPropagation();

          if (kRef.current) {
            kRef.current.position.set(...kPresentationPos);
            kRef.current.rotation.set(0, 0, 0);
            setState((state) => ({ letters: { ...state.letters, k: true } }));
            addAchievement(AchievementName.DK);
          }
        }}
      />
    </group>
  );
}

useGLTF.preload('/letters.gltf');
