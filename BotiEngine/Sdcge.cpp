#include "Sdcge.h"

#include "stdafx.h"

Sdcge::Sdcge()
{
	GlutAbstraction * glutAbstraction = new GlutAbstraction();
	iVideo = glutAbstraction;
	iTimer = glutAbstraction;
}

Sdcge::~Sdcge()
{
}