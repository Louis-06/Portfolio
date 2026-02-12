#!/usr/bin/env python3
"""
Script pour générer un hash SHA-256 d'un mot de passe.
"""

import hashlib
import getpass

def generate_hash(password):
    """Génère un hash SHA-256 du mot de passe"""
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

if __name__ == "__main__":
    print("=" * 60)
    print("Générateur de hash de mot de passe pour la protection de page")
    print("=" * 60)
    print()
    
    password = getpass.getpass("Entrez le mot de passe à hasher : ")
    
    if not password:
        print("❌ Erreur : Le mot de passe ne peut pas être vide.")
        exit(1)
    
    password_hash = generate_hash(password)
    
    print()
    print("✅ Hash généré avec succès !")
    print()
    print("Copiez ce hash dans custom.js à la place de 'VOTRE_HASH_ICI' :")
    print("-" * 60)
    print(password_hash)
    print("-" * 60)
    print()
    print("Note : Conservez ce mot de passe en sécurité !")
    print("       Le hash seul ne permet pas de retrouver le mot de passe.")
